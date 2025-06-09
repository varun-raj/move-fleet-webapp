# Move Fleet

## Actors or Acting Organizations

### Clearing Agency
The one who posts jobs


### Transporters
1. The one who bids jobs 
2. They own vehicles 
3. They move the fleet and update the job based on their bid approval

### Delivery Agency
1. They approve the delivery of a job upon inspection 


## Models

### Organization
The entity that acts on a job with different access levels based on its type.

### User
The indivuduals who are part of an organization through their membership

### Membership
The link between the organization and user with defined role.

### Partnerships
A link between an organization and a transporter to show the transporter is a partner of the organization.

### Jobs
A collection of JobConsignment created by the clearing agency for bidding and the transported bid them via JobBids. 

1. A job will have a pickup yard and a delivery yard.
2. A job will show list of required vehicles based on the consignments.


### JobConsignment
Job Consignment is a container with a unique identifier, and also will consume specific capacity of a vehicle.

1. 20ft container
2. 40ft container

### JobBid
A bid is a proposal to transport a consignment. Initiated by the transporter.

1. A bid will be to a specific job consignment.
2. A bid will be to a specific vehicle.

### JobBidLineItem
A bid line item is a line item in a bid that represents a consignment.


### Vehicles
The Transporters own vehicles, the vehicles can have different capacities.

1. 20ft container (Can fit 1 x 20ft Consignment)
2. 40ft container (Can fit 2 x 20ft Consignment or 1 x 40ft Consignment)

## Yards
The pick up or delivery yard is a location where the consignment is picked up or delivered.

1. A Yard can be public or private.
2. Private yards are owned by the clearing agency.
3. Public yards are owned by the system and visible to everyone.



