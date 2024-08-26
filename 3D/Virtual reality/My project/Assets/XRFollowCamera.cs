using UnityEngine;

public class FollowCamera : MonoBehaviour
{
    public Vector3 offset;  // Public offset variable to set in the Inspector
    public float fixedYPosition = 0f;  // Fixed Y position for the cube

    private Transform cameraTransform;

    void Start()
    {
        // Get the main camera's transform
        cameraTransform = Camera.main.transform;
    }

    void Update()
    {
        // Calculate the target position based on the camera's position and the offset
        Vector3 targetPosition = cameraTransform.position + cameraTransform.TransformDirection(offset);

        // Set the Y position to the fixed value
        targetPosition.y = fixedYPosition + cameraTransform.transform.position.y;

        // Apply the target position to the cube
        transform.position = targetPosition;

        // Match the camera's Y rotation (ignore X and Z rotation)
        Vector3 targetRotation = new Vector3(0, cameraTransform.eulerAngles.y, 0);
        transform.rotation = Quaternion.Euler(targetRotation);
    }
}