#!/usr/bin/env node
/**
 * TLDMint MCP Server (stdio <-> https://tldmint.com/api/mcp)
 * Zero-dependency Model Context Protocol server for Claude Desktop, Cursor, Windsurf, Cline & AI Agents.
 * Website & Docs: https://tldmint.com/ai-api/
 */
import readline from 'node:readline';

const ENDPOINT = process.env.TLDMINT_MCP_URL || 'https://tldmint.com/api/mcp';

async function forwardRpc(message) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'tldmint-mcp-stdio/1.0.0 (+https://tldmint.com/ai-api/)',
    },
    body: JSON.stringify(message),
  });

  if (res.status === 202 || res.status === 204) {
    return null;
  }

  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

if (process.argv.includes('--self-test')) {
  const init = await forwardRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  const tools = await forwardRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
  console.log('TLDMint MCP Self-Test OK:', {
    server: init?.result?.serverInfo,
    toolCount: tools?.result?.tools?.length,
    tools: (tools?.result?.tools || []).map((t) => t.name),
  });
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    process.stdout.write(
      JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }) + '\n'
    );
    return;
  }

  // Notifications have no id and expect no response
  const isNotification = msg.id === undefined;

  try {
    const reply = await forwardRpc(msg);
    if (!isNotification && reply) {
      process.stdout.write(JSON.stringify(reply) + '\n');
    }
  } catch (err) {
    if (!isNotification) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id ?? null,
          error: {
            code: -32603,
            message: err instanceof Error ? err.message : 'Upstream TLDMint MCP error',
          },
        }) + '\n'
      );
    }
  }
});
