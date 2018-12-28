## woza-desktop

Dump application ipa from jailbroken iOS based on frida. 

## Download

[Latest Release](https://github.com/woza-lab/woza-desktop/releases)

## Environment

1. frida

Jailbroken iOS need `frida` installed. [How to install frida](https://www.frida.re/docs/ios/#with-jailbreak)

2. password-free ssh

```
ssh-copy-id -i ~/.ssh/id_rsa root@ip -P 22
```

3. usbmuxd

```
brew install usbmuxd
```

4. iproxy

```
iproxy 2222 22
```


## Usage

1. click device

2. click woza for target application

3. ipa will be sent to your desktop.


## Develop

```
// run react
npm run 1

// run electron
npm run 2


// make dmg
sh ./dist.sh
```

---

*Enjoy :)*
