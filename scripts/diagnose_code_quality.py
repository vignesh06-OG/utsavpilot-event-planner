import os
import re

def analyze_codebase():
    results = {
        'any_usages': [],
        'as_any_usages': [],
        'non_null_assertions': [],
        'react_fc_usages': [],
        'misplaced_imports': [],
        'unused_or_redundant_state': [],
        'file_sizes': {},
        'repeated_patterns': []
    }

    for root, dirs, files in os.walk('.'):
        if any(p in root for p in ['node_modules', '.git', 'dist', 'build', 'scripts']):
            continue
        for f in files:
            if f.endswith(('.ts', '.tsx')):
                p = os.path.normpath(os.path.join(root, f))
                with open(p, 'r', encoding='utf-8') as fh:
                    lines = fh.readlines()
                    results['file_sizes'][p] = len(lines)
                    
                    seen_declaration = False
                    for idx, line in enumerate(lines, 1):
                        stripped = line.strip()
                        
                        # Check misplaced imports (imports after declarations)
                        if stripped.startswith('import ') or stripped.startswith('import type '):
                            if seen_declaration:
                                results['misplaced_imports'].append((p, idx, stripped))
                        elif stripped and not stripped.startswith('//') and not stripped.startswith('/*') and not stripped.startswith('*'):
                            if not stripped.startswith('import ') and not stripped.startswith('import type '):
                                seen_declaration = True

                        # Check any
                        if re.search(r'\bas\s+any\b', line):
                            results['as_any_usages'].append((p, idx, stripped))
                        elif re.search(r':\s*any\b', line):
                            results['any_usages'].append((p, idx, stripped))

                        # Check non-null assertions (!)
                        if re.search(r'[a-zA-Z0-9_]\!(?:\.|\)|\[)', line):
                            results['non_null_assertions'].append((p, idx, stripped))

                        # Check React.FC
                        if 'React.FC<' in line:
                            results['react_fc_usages'].append((p, idx, stripped))

                        # Check redundant state pattern (like const [now] = useState(() => Date.now()))
                        if re.search(r'const\s+\[\s*now\s*\]\s*=\s*(?:React\.)?useState', line):
                            results['unused_or_redundant_state'].append((p, idx, stripped))

    return results

res = analyze_codebase()
print(f"=== CODE QUALITY DIAGNOSTIC SUMMARY ===")
print(f"1. 'as any' casts: {len(res['as_any_usages'])}")
for p, l, s in res['as_any_usages']:
    print(f"   {p}:{l} -> {s}")

print(f"\n2. ': any' annotations: {len(res['any_usages'])}")
for p, l, s in res['any_usages']:
    print(f"   {p}:{l} -> {s}")

print(f"\n3. React.FC legacy typing: {len(res['react_fc_usages'])}")
for p, l, s in res['react_fc_usages']:
    print(f"   {p}:{l} -> {s}")

print(f"\n4. Misplaced imports (after declarations): {len(res['misplaced_imports'])}")
for p, l, s in res['misplaced_imports']:
    print(f"   {p}:{l} -> {s}")

print(f"\n5. Redundant/Unnecessary state: {len(res['unused_or_redundant_state'])}")
for p, l, s in res['unused_or_redundant_state']:
    print(f"   {p}:{l} -> {s}")

print(f"\n6. Non-null assertions (!): {len(res['non_null_assertions'])}")
for p, l, s in res['non_null_assertions']:
    print(f"   {p}:{l} -> {s}")

print(f"\n7. Component file sizes (lines > 300):")
for p, sz in sorted(res['file_sizes'].items(), key=lambda x: -x[1]):
    if sz > 300:
        print(f"   {p}: {sz} lines")
