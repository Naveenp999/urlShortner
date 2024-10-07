
# Project Title

Advanced URL Shortener with Advanced Analytics


## API Reference

#### Get Original Url

```http
  GET /r/${short_code}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `short_code` | `string` | **Required**. Your short_code |

#### POST item

```http
  POST /shorten
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `originalUrl`      | `string` | **Required**. 



```http
  GET /${short_code}
```

|Parameter| TYpe | Description | 
:--------| :--------- | :----------------------|
|`short_code`| `String`| `short_code for analytics` |
## Appendix

Any additional information goes here


## Features

- Long Url to Short Url
- Url analytics (NoOfVisiters,NofUniqueVisiters,
avgVisitersPerDay,avgVisitersPerDate,Device Types)
## Authors

- [@Naveen](https://github.com/Naveenp999)


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT NUMBER`

`SERVER URL`


## SQL TABLES

Total 3 TABLES

Table-1

    ORIGINAL_URL,SHORT_CODE,CREATED_AT, ID

TABLE2

    ID,SHORT_CODE_ID,IP_ADDRESS_ID,TIMESTAMP


TABLE3

    USER_ID,USER_IP_ADDRESS

## ScreenShots

 - [App Analytics Page](https://drive.google.com/uc?export=view&id=1M4COfgYhoPxL8dO7HVU_q3JOvgSlE3qU)
 - [App Home Page](https://drive.google.com/file/d/1gc26hGiHb3ajMe-Wxm10ztg114cQI-uV/view?usp=sharing)
 
