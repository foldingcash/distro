# distro

This repo is intended to house the tools needed to send SLP tokens to folders.
Folders being users of the Folding@Home network that have correctly configured their name.

## Running

Clone this repo, open a command line in the created directory

Update configuration/wallet with your wallet and token information

Run ```npm i```

Run ```npm run distro 100000 01-01-2020 06-18-2020```

The distro expects amount, start date, and then end date.

While testing, there is a command to help with testing

```npm run distro:test```

which should be used to simply send a static amount and start/end date.

## Updating @foldingcash Dependencies

The @foldingcash/slp-sdk dependency may not actually update to version by editing package.json; instead use npm to install a specific version

```
npm i datacash@git+https://github.com/foldingcash/datacash.git#v0.1.0-rc1
```