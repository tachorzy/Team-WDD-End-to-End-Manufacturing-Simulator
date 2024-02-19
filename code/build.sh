# Install Node.js and npm
NODE_VERSION="20.0.0"
PLATFORM="linux-x64"

NODE_DIR="$HOME/node"

check_node_exist() {
    if [ -x "$NODE_DIR/bin/node" ]; then
        INSTALLED_VERSION=$($NODE_DIR/bin/node -v)
        if [ "v$NODE_VERSION" = "$INSTALLED_VERSION" ]; then
            return 0
        fi
    fi
    return 1
}

install_node() {
  # Create Node.js directory
  mkdir -p "$NODE_DIR"
  # Download Node.js binary
  curl -o "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM.tar.xz"
  # Extract Node.js
  tar -xJf "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" -C "$NODE_DIR" --strip-components=1
  # Clean up the tarball
  rm "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz"
}

if check_node_exist; then
    echo "Node.js v$NODE_VERSION is already installed."
else
    echo "Node.js v$NODE_VERSION is not installed. Installing now..."
    install_node

    # Verify installion
    node -v
    npm -v

# Update PATH to include the Node.js binary
export PATH="$NODE_DIR/bin:$PATH"

# backend
# cd ./backend/api
# go get ./...
# go build -o build/main -v cmd/main.go
# go test ./...

# frontend
cd manufacturing-sim
chmod +x build.sh
./build.sh
