using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class LayerController : MonoBehaviour
{
    public GameObject hideButton; // Assign the Hide button object in the Inspector
    public GameObject showButton; // Assign the Show button object in the Inspector
    [SerializeField] ///asa poti vedea in inspector 
    private Transform layers; 
    private int currentLayer = 0; // Current layer index

    private void Start()
    {
        //for (int i = 0; i < layers.childCount; i++) 
        //{
        //    Debug.Log(layers.GetChild(i).name); //used for debug help
        //}

        // Register XR Interaction events for Hide and Show buttons
        if (hideButton != null)
        {
            var hideInteractable = hideButton.GetComponent<XRGrabInteractable>();
            if (hideInteractable != null)
            {
                hideInteractable.onSelectEntered.AddListener(OnHideButtonGrabbed);
            }
        }

        if (showButton != null)
        {
            var showInteractable = showButton.GetComponent<XRGrabInteractable>();
            if (showInteractable != null)
            {
                showInteractable.onSelectEntered.AddListener(OnShowButtonGrabbed);
            }
        }
    }

    private void OnHideButtonGrabbed(XRBaseInteractor interactor)
    {
        // Hide the current layer and move to the next layer
        if (currentLayer >= 0 && currentLayer < layers.childCount)
        {
            layers.GetChild(currentLayer).gameObject.SetActive(false); // Hide current layer

            // Move to the next layer
            currentLayer++;
        }
    }

    private void OnShowButtonGrabbed(XRBaseInteractor interactor)
    {
        // Show the previous layer and move to the previous layer
        if (currentLayer > 0 && currentLayer <= layers.childCount)
        {
            
            layers.GetChild(currentLayer-1).gameObject.SetActive(true); // Hide current layer

            // Move to the previous layer
            currentLayer--;
        }
    }

    private void OnDestroy()
    {
        // Unregister XR Interaction events to prevent memory leaks
        if (hideButton != null)
        {
            var hideInteractable = hideButton.GetComponent<XRGrabInteractable>();
            if (hideInteractable != null)
            {
                hideInteractable.onSelectEntered.RemoveListener(OnHideButtonGrabbed);
            }
        }

        if (showButton != null)
        {
            var showInteractable = showButton.GetComponent<XRGrabInteractable>();
            if (showInteractable != null)
            {
                showInteractable.onSelectEntered.RemoveListener(OnShowButtonGrabbed);
            }
        }
    }
}
