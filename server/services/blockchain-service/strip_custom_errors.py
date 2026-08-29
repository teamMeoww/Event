import re
import sys

def strip_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    content = re.sub(r'public List<.*?WithLog.*?\}.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'public static RemoteCall<.*?deployRemoteCall.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'public static.*?staticExtractEventParametersWithLog.*?\}.*?\}', '', content, flags=re.DOTALL)
    
    content = re.sub(r'public static class .*?EventResponse \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'public List<.*?EventResponse> get.*?Events\(.*?\).*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'public Flowable<.*?EventResponse> .*?EventFlowable\(.*?\).*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'public static RemoteCall<.*?deploy.*?\}.*?\}', '', content, flags=re.DOTALL)

    with open(filename, 'w') as f:
        f.write(content)

strip_file('src/main/java/com/eventone/blockchainservice/contract/EventOneTicket.java')
strip_file('src/main/java/com/eventone/blockchainservice/contract/EventOneCredential.java')

