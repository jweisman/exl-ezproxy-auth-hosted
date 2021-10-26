# Ex Libris Hosted EZproxy Authentication Service
 
This is a hosted implementation of a service which allows [EZproxy](https://www.oclc.org/en/ezproxy.html) to authenticate users stored in the [Ex Libris Identity Service](https://knowledge.exlibrisgroup.com/Alma/Product_Documentation/010Alma_Online_Help_(English)/090Integrations_with_External_Systems/060Authentication/Ex_Libris_Identity_Service) via EZproxy [external script authentication](https://help.oclc.org/Library_Management/EZproxy/Authenticate_users/EZproxy_authentication_methods/External_script_authentication). The app can be configured using the EZproxy Auth Cloud App.

The authenticator includes the following features:
* Configuration of authenticator (for users with the General Administrator role), including API key and groups
* Health check of configuration
* Test form

## Usage
The authenticator is configured using a Cloud App. Activate the _EZproxy Auth Config_ Cloud App in your Alma session. 

### Health check
When the Cloud App is opened, the health of the authenticator is checked. If the authenticator is set up correctly, the EZproxy configuration string will be displayed. 

### Test form
To test the authenticator, click the _Test_ button. Enter credentials stored in the Ex Libris Identity Provider and submit the form. A new tab will be opened and the authenticator will diplay the results, including whether the credentials are valid and the EZproxy group, if any.

### Configuration
The General System Administrator role is required to configure the authenticator. Click the _Configuration_ button. Enter an API key configured in the Developer Network with read/write permissions on the _Users_ area. 

EZproxy supports groups to facilitate the granting of permissions. To map Alma user groups to an EZproxy group, click the _Add group_ button. Enter the name of the EZproxy group. Then add Alma user groups to the list. When a user in one of those user groups logs in to EZproxy, the authenticator will return the corresponding EZproxy group according to the mapping.