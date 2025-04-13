# Federated Catalogue



## How to locally deploy the XFSC Federated Catalogue​


1. Download the release 1.3.0 of the XFSC Federated Catalogue [here](https://gitlab.eclipse.org/eclipse/xfsc/cat/fc-service/-/releases). You have also the option to clone it from its [Repository](https://gitlab.eclipse.org/eclipse/xfsc/cat/fc-service) (Make sure to select the branch ``release/1.3.0``).
2. Run 'mvn clean install' from the root folder​

    **Note**: Java [Version 21](https://www.oracle.com/java/technologies/downloads/?er=221886#java21) and Maven from [Version 3.8.8](https://maven.apache.org/download.cgi) are required. Please ensure that their ​paths are correctly set.
3. Switch to folder ``docker`` and run ``docker-compose up`` from there​

    **Note**: It might be necessary to run this command more than once, since some containers ​depend on each other
4. Add ``127.0.0.1 key-server`` to your ``hosts`` file​

    **Note**: The 'hosts' file can be found here:​

        Windows: 'c:\Windows\System32\Drivers\etc\hosts'​
        MacOS Linux: '/etc/hosts'
5. Open keycloak admin console at http://key-server:8080/admin, with **admin/admin** credentials,​ select gaia-x realm.
6. Go to users and create one to work with. Set its username and other attributes, save. Then go to​ Credentials tab, set its password twice, disable Temporary switch, save. Go to Role Mappings​ tab, in Client Roles drop-down box choose federated-catalogue client, select Ro-MU-CA role and​ add it to Assigned Roles.
7. Rebuild ``FC image`` and restart ``fc-service-server`` container to pick up changes applied at the second step above.
8. Now, the XFSC Catalog API Endpoints should be accessible using this [postman collection](https://gitlab.eclipse.org/eclipse/xfsc/cat/fc-service/-/blob/main/fc-tools/Federated%20Catalogue%20API.postman_collection.json?ref_type=heads) ​while providing the required setting inputs based on the current environment. Please find those ​Inputs and other command lines in the [Cheatsheet](https://fraunhofer-my.sharepoint.com/personal/ahmad_hemid_fit_fraunhofer_de/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fahmad%5Fhemid%5Ffit%5Ffraunhofer%5Fde%2FDocuments%2FMicrosoft%20Teams%2DChatdateien%2FCheatsheet%2Etxt&parent=%2Fpersonal%2Fahmad%5Fhemid%5Ffit%5Ffraunhofer%5Fde%2FDocuments%2FMicrosoft%20Teams%2DChatdateien&ga=1). 

## How to deploy the XFSC Federated Catalogue​ using helm charts

1. Download the release 1.3.0 of the XFSC Federated Catalogue [here](https://gitlab.eclipse.org/eclipse/xfsc/cat/fc-service/-/releases). You have also the option to clone it from its [Repository](https://gitlab.eclipse.org/eclipse/xfsc/cat/fc-service) (Make sure to select the branch ``release/1.3.0``).
2. To install the Federated Catalogue with helm manually, switch to the Federated Catalogue root folder and run the following commands:

        > cd deployment/helm
        > helm install fed-cat ./fc-service --namespace fed-cat --create-namespace