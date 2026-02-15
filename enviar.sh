#!/bin/bash
echo "📦 Preparando envio para o GitHub..."
git add .
git commit -m "Upload para o Render: $(date)"
git push origin main
echo "✅ Código enviado com sucesso! O Render vai detectar agora."
