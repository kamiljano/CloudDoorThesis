# About

The following repository contains [Kamil Janowski's master degree thesis](https://github.com/kamiljano/CloudDoorThesis/raw/master/Kamil%20Janowski%20-%20master's%20thesis.docx),
focusing on comparison of architecture
of Command & Control (CnC) servers on various platforms. The goal of the comparison is to find the most efficient
and cost effective method to remotely control the malware.

To simplify the project, increase the development speed and ensure portability of common modules,
both server side as well as the client side code of the Prove of Concept will be written
with the help of Node.js. In real life applications however at least the client side
should be written in a lower level language, to lower the risk of detection by the antivirus software.

# Use cases

According to Norton the following are the most common botnet use cases:
* Executing a DDoS attacks
* Emailing spam to millions of internet users
* Generating fake Internet traffic on a third-party website for financial gain.
* Replacing banner ads in your web browser specifically targeted at you.
* Pop-ups ads designed to get you to pay for the removal of the botnet through a phony anti-spyware package.

Additionally very recently it became more and more visible that the botnet trends slowly shift
toward the crypto currency mining. In particular Monero tends to be a very common choice, as 
the currency is managed in such a way, that it's very difficult to track back how the coins 
were acquired, granting the attacker a layer of security.

# Approaches that will be reviewed in the study

## Standalone CnC

The most basic solution suggested by various blogs is a single standalone CnC server.

![Standalone architecture](architecture/standaloneArchitecture.png "Standalone architecture")

### Scalable standalone CnC

The previous solution has serious limitations in terms of performance. With larger number of clients, a single
Virtual Machine running the server might not have enough resources to run the system efficiently
(especially when it comes network capabilities). Simply increasing the specs of the machine is linked to drastically
rising costs of maintenance that remain constant even when the infrastructure is not currently in use.
That can be fixed by autoscaling. However, if we create more than 1 instance of our server, we need to introduce:

* A load balancer that will make sure the load is evenly distributed across the server instances, as well as 
spawn/kill additional server instances should that be needed

* A form of shared memory that will contain the information about all currently connected clients, that could be
instantly pulled by the administrator trying to see the full list of all clients and by the server instances themselves,
to make sure that each ID that they assign to the client are unique 

![Standalone standalone architecture](architecture/standaloneArchitectureScaled.png "Standalone scalable architecture")

### Standalone POC

A Proof of Concept has been implemented for the standalone approach and can be found
[here](https://github.com/kamiljano/CloudDoorThesis/tree/master/poc/standalone).

## Google Cloud Platform serverless CnC

After exploring the possible implementations on the Google Cloud Platform, I have concluded,
that a legitimate serverless implementation is not feasible using that platform. This is due 
to the lack of an appropriate push notification service.

For more information on the topic refer to the [POC README file](https://github.com/kamiljano/CloudDoorThesis/blob/master/poc/gcp/README.md)

## AWS serverless CnC

There's a number of different ways a serverless CnC application can be implemented using the AWS services.
We could consider deliverying the command to the client through any of the following services:

* SNS - normally meant for deliverying the push notifications only to AWS-hosted services, but can be worked around
* AppSync - a very recently released service meant for building all sorts of social media and chats.
* IoT - designed from scratch to handle the communication with applications/devices hosted outside of the cloud.

Here's an example approach using the AWS IoT:

![AWS IoT architecture](architecture/awsArchitecture.png "AWS IoT architecture")

### AWS-based POC using IoT service

A Proof of Concept has been implemented for the AWS-based approach and can be found
[here](https://github.com/kamiljano/CloudDoorThesis/tree/master/poc/aws).

## Azure serverless CnC

Azure, just like any other cloud platform, provides the possibility of introducing serverless
backend logic. They call it Azure Functions and they are not that much different from 
the AWS Lambdas and Google Cloud Functions, with the exception that the trigger has to be 
specified in the very beginning in a separate file located in the root directory of the function.

Azure provides several different services that can be used to deliver a command to the bot:

* SignalR - a websocket-based service. Originally designed for Chat applications.

* IoT Hub - another IoT service. It allows not only the message delivery and management of the telemetry
data, but also remote function invocation, what makes it sound like it was specifically designed
for botnet management.

![Azure IoT architecture](architecture/azureArchitecture.png "Azure IoT architecture")

### Azure-based poc using IoT Hub

A proof of Concept has been implemented for the Azure-based approach with the IoT Hub and can be found 
[here](https://github.com/kamiljano/CloudDoorThesis/tree/master/poc/azure).