righthererightnow
=================


Installation Instructions
-------------------------

The beauty of using Javascript and its respective libraries is that no extra tools or utilities or any huge integrated development environment is needed to run our project.

There is some work done on the server side, but because this application requires internet access regardless, we let our server do that work for you. Of course, if you want to see the work that our server does or interact with it, you can look at the included app.py file which is a simple cherrypy appliction.

Of course, if all you want to do is download and run the application, you can do that with no trouble! Please follow these steps to get started:


Download the application by running:

    git clone https://github.com/trustdarkness/righthererightnow.git

Then cd into the project directory (usually righthererightnow) and type:

    python -m SimpleHTTPServer
    
You can now access the application on your local machine at

    http://localhost:8000
    
Although the application would run in any modern web browser, We recommend that latest version of Google Chrome should be used to run the application. 

About the Project
-----------------

Right Here! Right Now! is the third project in the CS 424 : Visualization and Visual Analytics course at University of Illinois at Chicago(UIC). The focus of the project is to make an interactive application displaying the 311 data available from city of Chicago and also the various transit systems like CTA Bus System and Divvy Bike Sharing System.

The goal of the project was to create an application which can be used by an user to travel through and discover Chicago in the best possible way. To aid the user to make decisions, we give the user various types of relevant data. The data is split into various layers which can be toggled on and off so that the user always has the control over what he/she wants to explore. The Layers on our application are various types of 311 data, Divvy Bike Stations and CTA Tracker. We wanted to give the user the option of not only able to decide if his/her interests but also discover new places of interest. Along with the various points of interest, We wanted to give the user option of seeing the various public transit systems around his point of interest.
Listed below are the various types of views the user can show from.

    Various Types of 311 Data
    Crime Commited
    Reported PotHoles
    Abandoned Vehicles
    Broken StreetLights
    Food Inspection

    Modes of Transit
    CTA Bus Tracker
    This tracker gives information about
    Divvy Bike Sharing Service

    Active Point of Interests
    Restaurants & Taverns & Special Event Food
    Music and Dance Places
    Mobile Food License
    Outdoor Patio
    Package Goods
    Public Garage
    Public Place of Amusement

    Other Information
    Current Weather
    Sunrise and Sunset Functionality
    Current Time

At the same time, the user may or may not care about overall city of Chicago and may be concerned about seeing information only in a certain community/neighbourhood of Chicago or maybe want to check whats available near by. For this specific purpose, We have incorporated various modes in our application. The user can choose to view information of the below given modes.

Modes
-----
    
*Path Mode*

The user picks his start and ending destination points and we give the user the route along major streets. We have designed the application in such a manner that the user can even choose the path he/she wants to take by simply dragging the path and it automatically routes to the new route. To keep the data relevant, we have chosen a 2 block radius to show data along the path created. This way the user can know whether that particular route is safe or not and can actually compare between routes.
    
*Box Mode*

The user picks two points and the user will be able to see data in the selected box. The boundary shows the selected region. This allows the user to see data in a much larger area and see what is around and about.


Along with the different layers, we have visualizations for all the 311 data which allows the user to quickly see if the statistics of the selected area versus the statistics of city of chicago. The visualizations are broken down into last week and last month so that the user can see a trend between different times and between the area and the city itself.

We have tried to create the application from an user's point of view and tried to incorporate things which would help the user navigate and discover new points of interest and in general give the user a sense of how the city is in the selected area. 311 data is a big deal in Chicago and it being public is a huge plus. Through our application , we hope that users have a more usable and friendly interface to access this and discover this beautiful city of Chicago. 

Team Members
------------

*Sharad Tanwar*

Sharad worked specifically on map features like implementation of the different layers and routing- box and path. He also worked on restriction of data through use of SodaAPI Queries and restriction of data in path mode. He also helped out in creating visualizations.

*__Shahbaz Khan__*

__Shahbaz__ worked on visualizations needed for statistics in the project. __Shahbaz__ worked on documentation of the overall project and design decisions. He helped in restrciting data in box mode. He also implemented icons and color designs for various layers. 

*Christopher Thomas*

Christopher worked worked on graphs and documentation needed for the project.

*mt*

mt worked majorly on the UI elements and the design decisions of the overall project. He also implemented the refresh functionality of the complete project and notification center to display any new information coming up. He also implemented with leaflet routing machine and worked out chinks in the application. 
