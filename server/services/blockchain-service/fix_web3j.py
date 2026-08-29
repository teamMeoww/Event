import sys

def fix_file(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
        
    out_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Replace getContractAddress() with contractAddress
        line = line.replace("getContractAddress()", "contractAddress")
        
        # Remove staticExtractEventParametersWithLog method
        if "staticExtractEventParametersWithLog" in line and "public static" in line:
            # skip until we see closing brace for this method
            brace_count = 0
            while i < len(lines):
                if "{" in lines[i]: brace_count += lines[i].count("{")
                if "}" in lines[i]: brace_count -= lines[i].count("}")
                i += 1
                if brace_count == 0: break
            continue
            
        # Remove any deployRemoteCall method
        if "deployRemoteCall" in line and "public static" in line:
            brace_count = 0
            while i < len(lines):
                if "{" in lines[i]: brace_count += lines[i].count("{")
                if "}" in lines[i]: brace_count -= lines[i].count("}")
                i += 1
                if brace_count == 0: break
            continue

        # Remove methods returning List<...WithLog> or Flowable<...WithLog>
        if ("WithLog>" in line or "WithLog" in line) and ("public List" in line or "public Flowable" in line):
            brace_count = 0
            while i < len(lines):
                if "{" in lines[i]: brace_count += lines[i].count("{")
                if "}" in lines[i]: brace_count -= lines[i].count("}")
                i += 1
                if brace_count == 0: break
            continue
            
        # Remove EventResponse classes since they use WithLog internally
        if "public static class" in line and "EventResponse" in line:
            brace_count = 0
            while i < len(lines):
                if "{" in lines[i]: brace_count += lines[i].count("{")
                if "}" in lines[i]: brace_count -= lines[i].count("}")
                i += 1
                if brace_count == 0: break
            continue
            
        # Remove methods returning EventResponse
        if ("EventResponse>" in line or "EventResponse" in line) and ("public List" in line or "public Flowable" in line):
            brace_count = 0
            while i < len(lines):
                if "{" in lines[i]: brace_count += lines[i].count("{")
                if "}" in lines[i]: brace_count -= lines[i].count("}")
                i += 1
                if brace_count == 0: break
            continue

        out_lines.append(line)
        i += 1

    with open(filename, 'w') as f:
        f.writelines(out_lines)

fix_file('src/main/java/com/eventone/blockchainservice/contract/EventOneTicket.java')
fix_file('src/main/java/com/eventone/blockchainservice/contract/EventOneCredential.java')
