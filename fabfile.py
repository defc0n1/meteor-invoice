from fabric.api import local, env, sudo, run, put
from fabric.context_managers import cd, prefix, lcd
from fabric.colors import yellow as _yellow
from fabric.contrib.project import rsync_project
import os.path
import inspect

env.meteor = 'meteor'
env.apps_path = '/apps'
env.log_dir = '/apps/log'
env.config_dir = '/apps/config'
env.pid_dir = '/apps/pid'
env.hosts = ['144.76.234.182']
env.user = 'root'
#env.hosts = ['54.204.24.80']
#env.user = 'ubuntu'
env.git_clone = 'https://github.com/mettienne/meteor-invoice.git'

# dev commands
def start_dev():
    with lcd(env.meteor):
        #local("source ../config/dev.sh && meteor")
        local("source ../config/dev.sh && meteor --settings ../config/settings.json")

# shared commands
def update():
    with cd(os.path.join(env.app_path, env.meteor)):
        run('mrt install')

# prod commands

def restart():
    run('supervisorctl reload')
    run('supervisorctl restart {}'.format(env.process))

def start_remote():
    with lcd(env.meteor):
        local("source ../config/test.sh && meteor")

def mongo_dev():
    local('mongo invoice')

def mongo_prod():
    local('mongo localhost:22282/invoice -u prod -p 12Trade34')

def mongo_staging():
    local('mongo localhost:22282/invoiceTest -u prod -p 12Trade34')

def mongo_prod_admin():
    local('mongo localhost:22282/admin -u mettienne -p luxemb0rg')

#def mongo_stage():
    #local('mongo localhost:27018/invoice_test -u mettienne -p luxemb0rg')

# environments

def staging():
    env.app_name = 'invoice_staging'
    env.app_path = os.path.join(env.apps_path, env.app_name)
    env.process = 'invoice_staging'

def prod():
    env.app_name = 'invoice'
    env.app_path = os.path.join(env.apps_path, env.app_name)
    env.process  = 'invoice'

#subcommands

def mkdirs():
    run('sudo mkdir -p {}'.format(env.apps_path))
    run('sudo chown {} {}'.format(env.user, env.apps_path))
    run('mkdir -p {}'.format(env.log_dir))
    run('mkdir -p {}'.format(env.config_dir))

def bundle():
    with cd(os.path.join(env.app_path, env.meteor)):
        run('pwd')
        run('meteor bundle ../deploy/out.tgz')
        run('tar -xzf ../deploy/out.tgz -C ../deploy/')
        run('rm ../deploy/out.tgz')

def copy():
    pass
    #with cd(env.app_path):
        #run('cp deploy/*.conf /etc/supervisor.d/invoice.conf')

def stage_db():
    run('''
            sudo supervisorctl stop edi_ftp_stage:* &&
            mongo invoice --eval "db.copyDatabase('invoice', 'invoice_staging')" &&
            sudo supervisorctl start edi_ftp_stage:*
            ''')


def clone():
    with cd(env.apps_path):
        run('git clone -q --depth 1 {} {} || true'.format(env.git_clone, env.app_name))

def install_deps():
    run('sudo npm install -g meteorite')


def pull():
    with cd(env.app_path):
        run('git checkout . ')
        run('git pull origin master')

def setup():
    mkdirs()
    clone()
    install_deps()

def deploy():
    pull()
    update()
    bundle()
    copy()
    #sync()
    restart()
