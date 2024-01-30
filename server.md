# to enable swap

    swapon --show
    sudo fallocate -l 4G /swapfile
    ls -lh /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    sudo swapon --show

# to check if swap enabled

    free -h

# to make swap permanent

    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    sudo sysctl vm.swappiness=10
    sudo sysctl vm.vfs_cache_pressure=50

# now edit the following file using nano

    sudo nano /etc/sysctl.conf

# paste these 2 lines at the end of file.. save and exit

    vm.swappiness=10
    vm.vfs_cache_pressure=50

# reboot and check swap if ok

    sudo reboot
    swapon --show

# Installing server

    sudo apt update && sudo apt upgrade
    sudo apt install nginx
    sudo systemctl status nginx

# Installing Git

    sudo apt install git

# pase your ssh key from local to remove and change permission

    sudo chmod 600 /root/.ssh/id_ed25519

# install nodejs

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
    nvm install --lts

# Setup nginx

    cd /etc/nginx/sites-available
    sudo nano dotheg.samuraiscripter.com

    # paste this
    server{
    		server_name dotheg.samuraiscripter.com;

    		location / {
    				proxy_pass http://localhost:3002; #whatever port your app runs on
    				proxy_http_version 1.1;
    				proxy_set_header Upgrade $http_upgrade;
    				proxy_set_header Connection 'upgrade';
    				proxy_set_header Host $host;
    				proxy_cache_bypass $http_upgrade;
    		}
    }

    sudo ln -s /etc/nginx/sites-available/dotheg.samuraiscripter.com /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx

# install pm2

    npm install pm2 -g

    pm2 start npm --name "dotheg" -- start
    pm2 save
    pm2 startup

# Certbot setup

    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d dotheg.samuraiscripter.com
