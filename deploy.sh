# install yarn
if [ ! -d ~/.yarn ];
  then curl -o- -L https://yarnpkg.com/install.sh | bash;
fi;
# install node modules
$HOME/.yarn/bin/yarn install;
# install apex
if [ ! -d ~/apex ];
  then curl -sL https://github.com/apex/apex/releases/download/v0.10.3/apex_linux_amd64 -o ~/apex;
  chmod +x ~/apex;
  rm -fr apex_linux_amd64;
fi;
# deploy
~/apex deploy
