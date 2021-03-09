# Webserver 2.0 specificiation

🚧 this is a work in process! It relies on technologies not yet released. 

This specification document is designed to help organize thoughts as much as possible prior to starting software.

# Motivation

Casserole has had a large amount of success using a rio-based webserver environment to allow the software team to specify points where data needs to be read or written, and propagate that data to any client device which supports web browsing.

The current infrastructure has some threading-based issues, is entirely custom, and relies on a (fairly) convoluted data server mechanism to provide data in a queue format. Though field-proven, it has a number of flaws (including client-induced crashes, using strings as GUID's, duplicated logic on server and client side, incomplete deployment to driver view.... the list goes on).

[Network Tables V4](https://github.com/PeterJohnson/allwpilib/blob/nt4/ntcore/doc/networktables4.adoc) covers the main functionality our custom data server was implemented to accomplish, and is therefor provides a convenient point for us to rework our web interface around more standardized toolsets.

# Basic Specifications

## Server

Jetty shall be retained as the http server. Unneeded libraries (eg websockets and json processing) should be removed if not needed. Update all libraries to latest version.

## Transport Layer

NT4 is the chosen transport mechanism.

## Java Code Interface

## Client Content
