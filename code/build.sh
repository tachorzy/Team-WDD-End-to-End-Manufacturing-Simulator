#!/bin/bash

# Go installation variables
GO_VERSION="1.20"
GO_PLATFORM="linux-amd64"
GO_DIR="$HOME/go"
GO_BIN="$HOME/go/bin"

# Node.js installation variables
NODE_VERSION="20.0.0"
NODE_PLATFORM="linux-x64"
NODE_DIR="$HOME/node"

check_go_exist() {
    if [ -x "$GO_BIN/go" ]; then
        INSTALLED_GO_VERSION=$($GO_BIN/go version | awk '{print $3}')
        if [ "go$GO_VERSION" = "$INSTALLED_GO_VERSION" ]; then
            return 0
        fi
    fi
    return 1
}

install_go() {
  # Create Node.js directory
  mkdir -p "$GO_DIR"
  # Download Go tarball
  curl -o "$GO_DIR/go$GO_VERSION.$GO_PLATFORM.tar.gz" "https://go.dev/dl/go$GO_VERSION.$GO_PLATFORM.tar.gz"
  # Extract Go tarball
  tar -C "$HOME" -xzf "$GO_DIR/go$GO_VERSION.$GO_PLATFORM.tar.gz"
  # Clean up the tarball
  rm "$GO_DIR/go$GO_VERSION.$GO_PLATFORM.tar.gz"
}

# Check and install Go if necessary
if check_go_exist; then
  echo "Go v$GO_VERSION is already installed."
else
  echo "Go v$GO_VERSION is not installed. Installing now..."
  install_go

  # Verify installation
  go version
fi

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
  # Download Node.js tarball
  curl -o "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM.tar.xz"
  # Extract Node.js tarball
  tar -xJf "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz" -C "$NODE_DIR" --strip-components=1
  # Clean up the tarball
  rm "$NODE_DIR/node-$NODE_VERSION-$PLATFORM.tar.xz"
}

# Check and install Node.js if necessary
if check_node_exist; then
  echo "Node.js v$NODE_VERSION is already installed."
else
  echo "Node.js v$NODE_VERSION is not installed. Installing now..."
  install_node

  # Verify installion
  node -v
  npm -v
fi

# Update PATH to include the Go and Node.js binary
export PATH="$GO_BIN:$NODE_DIR/bin:$PATH"

# Run backend script
cd backend/api
chmod +x build.sh
./build.sh

# Run frontend script
cd ../../manufacturing-sim
chmod +x build.sh
./build.sh
