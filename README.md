# CS6221-Crystal

Instruction for how to use Crystal in Vscode:
First thing we need to do is install Homebrew, follow these steps:
# For MacOS
1. Open Terminal
On macOS, you can open the Terminal by searching for it in Spotlight (Cmd + Space then type "Terminal") or from Applications > Utilities > Terminal.

2. Install Homebrew
Run the following command in the terminal to install Homebrew:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
This command downloads and runs the Homebrew installation script.

3. Follow the On-Screen Instructions
The script will show some details about the installation. You may be asked to enter your password to proceed.

After installation, Homebrew will prompt you to add it to your shell’s PATH. The instructions will look like this:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
Copy and paste these lines into your terminal to make brew accessible from any terminal session.

4. Verify Installation
After installation, verify that Homebrew is installed correctly by running:
brew --version
This should display the version of Homebrew installed, confirming it’s ready to use.

# For Windows:
1. Install Windows Subsystem for Linux (WSL)
Open PowerShell as Administrator and run the following command to enable WSL:

powershell
wsl --install
This command installs WSL with the default Ubuntu distribution. Restart your computer if prompted.

2. Open Ubuntu Terminal
Once WSL is installed, open the Ubuntu terminal from the Start menu.
3. Install Homebrew on WSL
In the Ubuntu terminal, run the following command to install Homebrew:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Follow the installation instructions. You may need to install some dependencies that Homebrew requires, which the installer will prompt you to do.

4. Add Homebrew to Your PATH
After installation, add Homebrew to your PATH by adding the following line to your .profile or .bashrc file:

echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
This command allows you to use brew from any terminal session in WSL.

5. Verify Installation
To check if Homebrew is installed correctly, run:

brew --version
You should see the version of Homebrew, confirming it’s ready to use on WSL.

# Installation for Crystal:
1. Install Crystal (MacOS)
If you're on macOS and have Homebrew installed, you can install Crystal by running:

brew install crystal

2. Install Crystal (Linux)
For Linux, you can install Crystal by following these steps:

curl -fsSL https://crystal-lang.org/install.sh | bash
Alternatively, on Ubuntu-based systems, you can use:
sudo apt update
sudo apt install crystal
3. Install Crystal (Windows)
For Windows, Crystal requires Windows Subsystem for Linux (WSL) or Docker since it doesn’t natively support Windows. You can install WSL, set up an Ubuntu distribution, and then follow the Linux installation steps.

4. Verify Installation
After installation, verify that Crystal is accessible by running:
crystal --version
