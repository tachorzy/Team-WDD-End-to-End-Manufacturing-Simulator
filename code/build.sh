# Install Node.js and npm
NODE_VERSION="20.0.0"
PLATFORM="linux-x64"

NODE_DIR="$HOME/node"
mkdir -p "$NODE_DIR"

# Download Node.js binary
echo "Downloading Node.js..."
curl -o "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM.tar.xz"

# Extract Node.js
echo "Extracting Node.js..."
tar -xJf "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" -C "$NODE_DIR" --strip-components=1

# Clean up the tarball
rm "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz"

# Update PATH to include the Node.js binary
export PATH="$NODE_DIR/bin:$PATH"

# Verify installation
echo "Node.js and npm versions:"
node -v
npm -v




# backend
# cd ./backend/api
# go get ./...
# go build -o build/main -v cmd/main.go
# go test ./...

# frontend
cd manufacturing-sim
chmod +x build.sh
./build.sh
