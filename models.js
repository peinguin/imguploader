exports.models = {
    "User":{
        "id":"User",
        "properties":{
            "id":{
                "type":"int"
            },
            "email":{
                "type":"string"
            },
            "password":{
                "type":"string"
            }
        }
    },
    "Image":{
        "id":"Image",
        "properties":{
            "id":{
                "type":"int"
            },
            "url":{
                "type":"string"
            },
            "datetime":{
                "type":"Date"
            },
            "tags":{
                "type": "array",
                "items": {
                    "$ref": "Tag"
                }
            }
        }
    },
    "Tag":{
        "id":"Tag",
        "properties":{
            "id":{
                "type":"int"
            },
            "email":{
                "name":"string"
            }
        }
    }
  }