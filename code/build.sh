#!/bin/bash

# Go installation variables
GO_VERSION="1.20"
GO_PLATFORM="linux-amd64"
GO_DIR="$HOME/go"
GO_BIN="$HOME/go/bin"

# golangci-lint installation variables
GOLANGCI_LINT_VERSION="1.51.0"
GOLANGCI_LINT_BIN="$HOME/.golangci-lint/bin"

# Node.js installation variables
NODE_VERSION="20.0.0"
NODE_PLATFORM="linux-x64"
NODE_DIR="$HOME/node"
NODE_BIN="$HOME/node/bin"

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
  # Create Go directory
  mkdir -p "$GO_DIR"
  # Download Go tarball
  curl -o "$GO_DIR/go.tar.gz" "https://dl.google.com/go/go$GO_VERSION.$GO_PLATFORM.tar.gz"
  # Extract Go tarball
  tar -xzf "$GO_DIR/go.tar.gz" -C "$GO_DIR" --strip-components=1
  # Clean up the tarball
  rm "$GO_DIR/go.tar.gz"
}

check_golangci_lint_exist() {
    if [ -x "$GOLANGCI_LINT_BIN/golangci-lint" ]; then
        INSTALLED_VERSION=$("$GOLANGCI_LINT_BIN/golangci-lint" --version | awk '{print $4}')
        if [ "$GOLANGCI_LINT_VERSION" = "$INSTALLED_VERSION" ]; then
            return 0
        fi
    fi
    return 1
}

install_golangci_lint() {
    # Create golangci-lint directory
    mkdir -p "$GOLANGCI_LINT_BIN"
    # Download golangci-lint binary
    curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b "$GOLANGCI_LINT_BIN" "v$GOLANGCI_LINT_VERSION"
}

check_node_exist() {
  if [ -x "$NODE_BIN/node" ]; then
    INSTALLED_VERSION=$($NODE_BIN/node -v)
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
  curl -o "$NODE_DIR/node.tar.xz" "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM.tar.xz"
  # Extract Node.js tarball
  tar -xJf "$NODE_DIR/node.tar.xz" -C "$NODE_DIR" --strip-components=1
  # Clean up the tarball
  rm "$NODE_DIR/node.tar.xz"
}

# Check and install Go if necessary
if ! check_go_exist; then
    echo "Go v$GO_VERSION is not installed. Installing now..."
    install_go
fi

# Check and install golangci-lint if necessary
if ! check_golangci_lint_exist; then
    echo "golangci-lint v$GOLANGCI_LINT_VERSION is not installed. Installing now..."
    install_golangci_lint
fi

# Check and install Node.js if necessary
if ! check_node_exist; then
    echo "Node.js v$NODE_VERSION is not installed. Installing now..."
    install_node
fi

# Update PATH to include the Go, Node.js, and golangci-lint binaries
export PATH="$GO_BIN:$NODE_BIN:$GOLANGCI_LINT_BIN:$PATH"
export GOPATH="$GO_DIR"

# Run backend script
cd backend/api
chmod +x build.sh
./build.sh
[ $? -eq 0 ] || exit 1

# Run frontend script
cd ../../frontend
chmod +x build.sh
./build.sh
[ $? -eq 0 ] || exit 1
