#!/bin/sh

##############################
## RentMeThat install script #
##############################

#This script is meant to be run on a brand new
#install of Ubuntu 14.04lts server

umask 0002


apt-get update
apt-get upgrade
sudo apt-get install nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node

##installs upstart capability
#cp deploy/rentmethat.config /etc/init/


#installed openssh-server because it wasn't installed
#installed vim
#created rentmethat-staging directory in /tmp



