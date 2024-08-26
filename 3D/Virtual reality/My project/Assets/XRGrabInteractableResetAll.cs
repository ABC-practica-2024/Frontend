using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class GrabInteractableTriggerAllReset : XRGrabInteractable
{
    private Vector3 initialPosition;
    private Quaternion initialRotation;
    private Vector3 startPosition;
    private Quaternion startRotation;

    public float resetDuration = 1.0f; // Total time (in seconds) to reset to the initial position and rotation

    private bool isResetting = false;
    private float elapsedTime = 0f; // Time elapsed since reset started

    private Collider objectCollider; // Reference to the collider component
    private Rigidbody rb; // Reference to the Rigidbody component

    protected override void Awake()
    {
        base.Awake();
        // Get the collider and Rigidbody components on this object
        objectCollider = GetComponent<Collider>();
        rb = GetComponent<Rigidbody>();
    }

    private void Start()
    {
        // Save the initial position and rotation of the object at the start of the program
        initialPosition = transform.position;
        initialRotation = transform.rotation;
    }


    // Method to be called when an object with this script is grabbed
    protected override void OnSelectEntered(SelectEnterEventArgs args)
    {
        base.OnSelectEntered(args);

        // Stop the reset process if it was ongoing
        isResetting = false;
        elapsedTime = 0f; // Reset elapsed time

        // Re-enable the collider if it was disabled
        if (objectCollider != null)
        {
            objectCollider.enabled = true;
        }

        // Optionally, set the Rigidbody to non-kinematic if needed
        if (rb != null)
        {
            rb.isKinematic = false;  // Allows physical interaction during the grab
        }

        // Call ResetObject on all artifacts
        ResetAllArtifacts();
    }

    protected override void OnSelectExited(SelectExitEventArgs args)
    {
        base.OnSelectExited(args);

        // Start the reset process
        isResetting = true;

        // Record the start position and rotation for linear movement
        startPosition = transform.position;
        startRotation = transform.rotation;

        // Disable the collider during the reset process
        if (objectCollider != null)
        {
            objectCollider.enabled = false;
        }

        // Set the Rigidbody to kinematic mode during reset
        if (rb != null)
        {
            rb.isKinematic = true; // Prevents physical forces from affecting the object
        }
    }

    public void ResetObject()
    {
        // Start the reset process
        isResetting = true;
        elapsedTime = 0f; // Reset elapsed time for the new reset

        // Disable the collider during the reset process
        if (objectCollider != null)
        {
            objectCollider.enabled = false;
        }

        // Set the Rigidbody to kinematic mode during reset
        if (rb != null)
        {
            rb.isKinematic = true; // Prevents physical forces from affecting the object
        }
    }

    private void Update()
    {
        if (isResetting)
        {
            // Increment elapsed time
            elapsedTime += Time.deltaTime;

            // Calculate the fraction of the duration that has passed
            float t = Mathf.Clamp01(elapsedTime / resetDuration);

            // Move the position linearly
            transform.position = Vector3.Lerp(startPosition, initialPosition, t);

            // Rotate the rotation linearly
            transform.rotation = Quaternion.Lerp(startRotation, initialRotation, t);

            if (t >= 1.0f)
            {
                // Ensure the object is exactly at the initial position and rotation
                transform.position = initialPosition;
                transform.rotation = initialRotation;

                // Stop the reset process
                isResetting = false;
                elapsedTime = 0f; // Reset elapsed time for future use

                // Re-enable the collider after the reset is complete
                if (objectCollider != null)
                {
                    objectCollider.enabled = true;
                }

                // Optionally, set the Rigidbody back to non-kinematic after the reset if needed
                if (rb != null)
                {
                    rb.isKinematic = false;  // Allows physical interaction after the reset
                }
            }
        }
    }

    private void ResetAllArtifacts()
    {
        // Find all objects tagged as "Artifact"
        GameObject[] artifacts = GameObject.FindGameObjectsWithTag("Artifact");
        foreach (GameObject artifact in artifacts)
        {
            // Get the CustomGrabBehavior component from the artifact
            CustomGrabInteractable grabBehavior = artifact.GetComponent<CustomGrabInteractable>();
            if (grabBehavior != null)
            {
                // Call ResetObject to start the reset process
                grabBehavior.ResetObject();
            }
        }
    }
}
