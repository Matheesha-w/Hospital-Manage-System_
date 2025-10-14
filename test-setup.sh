# HMS Setup Test Script

echo "🏥 Hospital Management System - Setup Test"
echo "=========================================="

# Check if Java 21 is installed
echo "Checking Java version..."
java -version 2>&1 | grep "21" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Java 21 is installed"
else
    echo "❌ Java 21 is not installed. Please install JDK 21"
    exit 1
fi

# Check if Node.js is installed
echo "Checking Node.js version..."
node --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "❌ Node.js is not installed. Please install Node.js"
    exit 1
fi

# Check if Maven is available
echo "Checking Maven..."
cd server
if [ -f "mvnw" ] || [ -f "mvnw.cmd" ]; then
    echo "✅ Maven wrapper is available"
else
    echo "❌ Maven wrapper not found"
    exit 1
fi

# Test backend compilation
echo "Testing backend compilation..."
if [ -f "mvnw" ]; then
    ./mvnw compile -q
else
    mvnw.cmd compile -q
fi

if [ $? -eq 0 ]; then
    echo "✅ Backend compiles successfully"
else
    echo "❌ Backend compilation failed"
    exit 1
fi

cd ..

# Test frontend dependencies
echo "Testing frontend dependencies..."
cd client
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "⚠️  node_modules not found. Run 'npm install' first"
    fi
else
    echo "❌ package.json not found"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup test completed!"
echo ""
echo "Next steps:"
echo "1. Start the backend: cd server && ./mvnw spring-boot:run"
echo "2. Start the frontend: cd client && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo "4. Login with admin/admin123 to test the system"
echo ""
echo "📚 For detailed setup instructions, see README.md"
