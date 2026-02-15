#!/bin/bash
# Pega a mensagem que você digitou ou usa uma padrão
MENSAGEM="${1:-Atualização automática: $(date)}"

echo "📦 Preparando envio: '$MENSAGEM'..."
git add .
git commit -m "$MENSAGEM"
git push origin main
echo "✅ Código enviado com sucesso!"
