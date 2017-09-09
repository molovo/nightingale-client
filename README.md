# Nightingale Client

[![npm](http://img.shields.io/npm/v/nightingale-client.svg?style=flat)](https://badge.fury.io/js/nightingale-client) [![tests](http://img.shields.io/travis/molovo/nightingale-client/master.svg?style=flat)](https://travis-ci.org/molovo/nightingale-client) [![dependencies](http://img.shields.io/david/molovo/nightingale-client.svg?style=flat)](https://david-dm.org/molovo/nightingale-client)

The front-end JavaScript client for Nightingale

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Why should you care?

This file contains the source code used to generate the [Nightingale](https://github.com/molovo/nightingale) browser client. **It does not work on its own as is.** It is included in Nightingale as a submodule and must be served via Nightingale's server in order to populate the connection URLs. To use this repository standalone, you must add the correct `hostname` and `port` for your environment into `src/index.js`, and update the output path in `gulpfile.js`.

### Installation

```sh
git clone https://github.com/molovo/nightingale-client
cd nightingale-client
gulp build
```

### Usage

How to use this project.

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
