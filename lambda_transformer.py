import json
from typing import Dict, List, Any

def transform_product_data(product_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform product data into a standardized JSON format.
    
    Args:
        product_data (dict): Raw product data dictionary
        
    Returns:
        dict: Transformed data in standardized format
    """
    transformed_data = {
        "product": {
            "size": product_data.get("Size", ""),
            "manufacturer_number": product_data.get("ManufacturerNumber", ""),
            "details": {
                "custom_fields": product_data.get("custom_fields", {}),
                "specifications": product_data.get("specifications", {})
            },
            "metadata": {
                "created_at": product_data.get("created_at", ""),
                "updated_at": product_data.get("updated_at", "")
            }
        }
    }
    return transformed_data

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler function to process product data.
    
    Args:
        event (dict): Lambda event containing product data
        context (object): Lambda context
        
    Returns:
        dict: Response with transformed data and status code
    """
    try:
        # Extract product data from the event
        product_data = event.get("product_data", {})
        
        # Transform the data
        transformed_data = transform_product_data(product_data)
        
        return {
            "statusCode": 200,
            "body": json.dumps(transformed_data),
            "headers": {
                "Content-Type": "application/json"
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json"
            }
        }

# Example usage
if __name__ == "__main__":
    # Sample product data
    sample_data = {
        "event": {
            "product_data": {
                "Size": "8 Hours",
                "ManufacturerNumber": "ABC123",
                "custom_fields": {
                    "field1": "value1",
                    "field2": "value2"
                },
                "specifications": {
                    "spec1": "value1",
                    "spec2": "value2"
                },
                "created_at": "2024-01-01",
                "updated_at": "2024-01-02"
            }
        }
    }
    
    # Test the lambda handler
    result = lambda_handler(sample_data["event"], None)
    print(json.dumps(result, indent=2)) 