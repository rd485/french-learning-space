#!/usr/bin/env bash
# ==========================================================================
#  set_llm_key.sh —— 把大模型 Key 存入本机隐藏文件（项目之外，不会被提交）
#
#  用法（在本项目目录里，用 Git Bash / WSL / 任意 bash 运行）：
#      bash set_llm_key.sh          # 交互式写入 Key / Base URL / 模型
#      bash set_llm_key.sh --clear  # 清空已保存的密钥
#
#  输入过程不会回显任何字符；最终写入：
#      ~/.french-llm-key   （Windows 上为 C:\Users\<你>\.french-llm-key）
#  该文件位于用户主目录，不属于本仓库，权限仅本人可读写。
#  改完直接生效（server.py 每次请求都会重新读取该文件，无需重启）。
# ==========================================================================
set -euo pipefail

KEYFILE="$HOME/.french-llm-key"

# 子命令：清空密钥
if [ "${1:-}" = "--clear" ]; then
  if [ -f "$KEYFILE" ]; then
    rm -f "$KEYFILE"
    echo "✅ 已删除密钥文件：$KEYFILE"
  else
    echo "（没有找到密钥文件，无需删除）"
  fi
  exit 0
fi

echo "=== 设置本地隐藏的 LLM Key ==="
echo "（输入过程不会回显；密钥仅保存在本机：$KEYFILE）"
echo "（该文件在项目目录之外，不会被 git 提交或上传）"
echo

# —— 1) API Key（隐藏输入）——
read -r -s -p "请输入 LLM API Key: " API_KEY
echo
if [ -z "${API_KEY:-}" ]; then
  echo "错误：Key 不能为空，已取消。" >&2
  exit 1
fi

# —— 2) 接口地址（可选，回车用默认）——
read -r -p "接口地址 Base URL [默认 https://api.openai.com/v1]: " BASE_URL
BASE_URL="${BASE_URL:-https://api.openai.com/v1}"

# —— 3) 模型名（可选，回车用默认）——
read -r -p "模型名 Model [默认 gpt-4o-mini]: " MODEL
MODEL="${MODEL:-gpt-4o-mini}"

# —— 写入隐藏文件 ——
{
  echo "# 本地 LLM 配置（自动生成，请勿提交到任何仓库）"
  echo "LLM_API_KEY=$API_KEY"
  echo "LLM_BASE_URL=$BASE_URL"
  echo "LLM_MODEL=$MODEL"
} > "$KEYFILE"

# 收紧权限：仅本人可读写（Windows 上 chmod 可能不生效，但无妨）
chmod 600 "$KEYFILE" 2>/dev/null || true

echo
echo "✅ 已保存至: $KEYFILE"
echo "✅ 权限已设为仅本人可读（chmod 600）。"
echo "提示：server.py 每次请求都会重新读取该文件，直接刷新页面即可使用，无需重启服务。"
echo "如需删除密钥：直接删掉该文件即可（rm \"$KEYFILE\"）。"
