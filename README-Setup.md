# Playwright MCP Setup Guide

This directory contains setup files for Microsoft's Playwright MCP (Model Context Protocol) server.

## Quick Start

1. **Run the setup script**: Double-click `setup-playwright-mcp.bat` or run it from Command Prompt
2. **Configure your MCP client** using one of the provided configuration examples

## Files in this directory

- `setup-playwright-mcp.bat` - Automated setup script for Windows
- `mcp-config-example.json` - Basic MCP server configuration
- `mcp-config-advanced.json` - Advanced configuration with multiple server options

## Prerequisites

Before running the setup script, ensure you have:

1. **Node.js 18 or newer** - Download from https://nodejs.org/
2. **Git** - Download from https://git-scm.com/
3. **MCP Client** - VS Code, Cursor, Windsurf, Claude Desktop, or similar

## Manual Setup (Alternative)

If you prefer manual setup:

```cmd
# Install globally
npm install -g @playwright/mcp

# Or use directly without installation
npx @playwright/mcp@latest
```

## Configuration

### Basic Configuration
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Advanced Options
- `--headless` - Run browser without UI
- `--browser chrome|firefox|webkit|msedge` - Choose browser
- `--device "iPhone 15"` - Emulate specific device
- `--vision` - Use screenshot-based mode
- `--isolated` - Use temporary profile
- `--viewport-size 1920,1080` - Set window size
- `--port 8931` - Run as standalone server

## Usage Examples

### Basic usage
```cmd
npx @playwright/mcp@latest
```

### Headless Chrome
```cmd
npx @playwright/mcp@latest --headless --browser chrome
```

### Mobile device emulation
```cmd
npx @playwright/mcp@latest --device "iPhone 15"
```

### Standalone server mode
```cmd
npx @playwright/mcp@latest --port 8931
```

## Troubleshooting

1. **Node.js not found**: Install Node.js from nodejs.org
2. **Git not found**: Install Git from git-scm.com
3. **Permission errors**: Run Command Prompt as Administrator
4. **Port conflicts**: Use different port with `--port` option

## More Information

- Repository: https://github.com/microsoft/playwright-mcp
- Playwright Documentation: https://playwright.dev/
- MCP Specification: https://modelcontextprotocol.io/

## Support

For issues with Playwright MCP, visit:
https://github.com/microsoft/playwright-mcp/issues
