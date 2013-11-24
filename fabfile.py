from fabric.api import local, env, sudo, run, put
from fabric.context_managers import cd, prefix, lcd
from fabric.colors import yellow as _yellow
from fabric.contrib.project import rsync_project
import os.path
import inspect

env.meteor = 'meteor'
env.apps_path = '/apps'
env.hosts = ['54.204.24.80']
env.user = 'ubuntu'

def bundle():
    print(_yellow('>>> starting {}'.format(_fn())))
    with lcd(env.meteor):
        local('pwd')
        local('meteor bundle --debug ../deploy/out.tgz')
        local('tar -xzf ../deploy/out.tgz -C ../deploy/')
        local('rm ../deploy/out.tgz')

def sync():
    print(_yellow('>>> starting {}'.format(_fn())))

def sync():
    print(_yellow('>>> starting {}'.format(_fn())))
    rsync_project(local_dir='deploy/', remote_dir=env.app_path, extra_opts='-L -i /Users/mikko/.ssh/mikko.pem')
    #local('rsync  -pthrvz -L -e "ssh -i /Users/mikko/.ssh/mikko.pem" deploy/ {}@{}:{}'.format(
        #env.user, env.hosts[0], env.app_path))

def start_dev():
    with lcd(env.meteor):
        #local("source ../config/dev.sh && meteor")
        local("source ../config/dev.sh && meteor --settings ../config/settings.json")

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
    env.monit = 'invoice_stage'

def prod():
    env.app_name = 'invoice'
    env.app_path = os.path.join(env.apps_path, env.app_name)
    env.monit = 'nodejs'

def restart():
    print(_yellow('>>> starting {}'.format(_fn())))
    run('monit restart {}'.format(env.monit))

def restart():
    print(_yellow('>>> starting {}'.format(_fn())))
    run('monit restart {}'.format(env.monit))

def mkdirs():
    print(_yellow('>>> starting {}'.format(_fn())))
    run('sudo mkdir -p {}'.format(env.app_path))
    run('sudo chown {} {}'.format(env.user, env.app_path))

def deploy():
    mkdirs()
    bundle()
    sync()
    restart()

def _fn():
    """
    Returns current function name
    """
    return inspect.stack()[1][3]
