import { CodeTabs } from '@/components/code-tabs';
 
const CODES = {
  Cursor: `// Copy and paste the code into .cursor/mcp.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
  Windsurf: `// Copy and paste the code into .codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
};
 
export const CodeTabsDemo = () => {
  return <CodeTabs lang="json" codes={CODES} />;
};  