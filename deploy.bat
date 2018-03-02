@ECHO OFF
CD dist
scp -r -F C:\Users\Vince\.ssh\config . root@static.divinitor.com:/var/www/reference.dn.divinitor.com/prod
