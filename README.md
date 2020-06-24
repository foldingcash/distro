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

```npm run distro test```

which should be used to simply send a static amount and start/end date.

### Additional Running Notes

* The distro API does not have it's timeouts configured long enough and will often timeout and disconnect...give it about 5 mins and try again...do this up to three times or check the logs to ensure it is a timeout/disconnect response. The distro API will enventually finish downloading the source files and cache the results which will allow this call to eventually work.

* The latest published ```slp-sdk```, 4.15.0, has a bug in a feature this code requires.
For now, to run with the bug fix, one will need to clone, build, and link the ```slp-sdk``` package.
