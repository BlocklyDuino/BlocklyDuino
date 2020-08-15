# Setting "Arduino web server"

## Ubuntu 18.04
### Conda Installation
1. Download the installer

Download Miniconda python 3.8 from https://docs.conda.io/en/latest/miniconda.html#linux-installers
```
cd ~/Downloads
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```
2. Run the installer
Open the terminal and run
```
bash Miniconda3-latest-Linux-x86_64.sh
* TYPE: Enter
* Accept licence terms: yes
* confirmation of conda path installation: /home/$USERNAME/miniconda/: Enter
* initialise conda with conda init: yes
```
If you are unsure about any setting, accept the defaults. You can change them later.
To make the changes take effect, close and then re-open your terminal window.
```
If you'd prefer that conda's base environment not be activated on startup, 
   set the auto_activate_base parameter to false: 

conda config --set auto_activate_base false
```

* see added lines to .bashrc 
```
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/xima/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/xima/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/home/xima/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/xima/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

```

4. Bash configuration
* `conda config --set auto_activate_base true`

5. Test your installation. In your terminal window or Anaconda Prompt, 
run the command `conda list`.  A list of installed packages appears if it has been installed correctly.

### Creating virtual environment in conda
1. Create environment.yml
vim environment-python2.yml
```
name: blockly
dependencies:
  - python2.7.*
```

2. create env
```
conda env create -f environment-python2.yml
```

3. check env list
```
conda env list
```

4. activate/deactivate env
```
conda activate blockly
conda deactivate
```

5. removing environment
```
conda remove --name myenv --all
```
* Removing environments [:link:](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#removing-an-environment)

### Uninstalling Anaconda or Miniconda
1. Open a terminal window.
2. Remove the entire Miniconda install directory with:
```
rm -rf ~/miniconda
```


* Miniconda linux installation [:link:](https://docs.conda.io/projects/conda/en/latest/user-guide/install/linux.html)

### Common issues
When running  `python arduino_web_server.py` and tryuing to upload with blockly using `firefox http://127.0.0.1:8080/`

1. no arduino and no port name
```
created sketch at /tmp/tmppYkuwf/tmppYkuwf.ino
INFO:root:Couldn't find Arduino command; hoping it's on the path!
INFO:root:Guessing port name as None
----------------------------------------
```
SORTED after installing arduino as root.
See [here](https://github.com/mxochicale/tools/tree/master/arduino#ubuntu-1804x64) for more regarding arduino installation.


2. No port name
```
INFO:root:Guessing port name as None
```
SORTED with the use of `python arduino_web_server.py --port=/dev/ttyUSB0`.

