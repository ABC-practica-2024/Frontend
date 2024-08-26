using UnityEngine;
using UnityEngine.XR;
using UnityEngine.XR.Interaction.Toolkit;

public class CustomMovement : MonoBehaviour
{
    public float speed = 3.0f;
    public XRNode inputSource;
    private InputDevice device;

    void Start()
    {
        device = InputDevices.GetDeviceAtXRNode(inputSource);
    }

    void Update()
    {
        if (!device.isValid)
            return;

        Vector2 inputAxis;
        if (device.TryGetFeatureValue(CommonUsages.primary2DAxis, out inputAxis))
        {
            Vector3 move = new Vector3(-inputAxis.x, 0, -inputAxis.y);
            transform.Translate(move * speed * Time.deltaTime);
        }
    }
}