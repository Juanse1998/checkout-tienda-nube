#!/bin/bash

echo "🚀 Iniciando Formulario de Pago - Tienda Nube"
echo ""

# Verificar si las dependencias están instaladas
if [ ! -d "api/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd api && npm install
    cd ..
fi

if [ ! -d "web/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd web && npm install --legacy-peer-deps
    cd ..
fi

echo ""
echo "✅ Dependencias instaladas"
echo ""
echo "🔧 Iniciando servidores..."
echo ""

# Iniciar backend en background
cd api
npm start &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
sleep 2

echo "✅ Backend corriendo en http://localhost:3001 (PID: $BACKEND_PID)"
echo ""

# Iniciar frontend
cd web
echo "✅ Frontend iniciando en http://localhost:3000"
echo ""
echo "📝 Presiona Ctrl+C para detener ambos servidores"
echo ""

npm run dev

# Cuando se detiene el frontend, detener también el backend
kill $BACKEND_PID
