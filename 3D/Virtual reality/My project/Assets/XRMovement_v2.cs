//using System.Collections;
//using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR;
using UnityEngine.XR.Interaction.Toolkit;
[RequireComponent(typeof(CharacterController))]
public class VRPlayerMovement : MonoBehaviour
{
    public float speed = 3.0f; // Viteza de mișcare
    public XRNode inputSource = XRNode.LeftHand; // Input din partea joystick-ului stâng
                                                 // public Transform cameraRig; // Referință la întreaga rig de VR (camera și obiectele copil)
    public Transform cameraTransform; // Referință la camera (capul utilizatorului)

    private Vector2 inputAxis;
    private CharacterController character;

    void Start()
    {
        character = GetComponent<CharacterController>();
    }

    void Update()
    {
        // Citire input de la joystick
        InputDevice device = InputDevices.GetDeviceAtXRNode(inputSource);
        device.TryGetFeatureValue(CommonUsages.primary2DAxis, out inputAxis);
    }

    void FixedUpdate()
    {
        // Calcularea direcției de mișcare pe baza input-ului de la joystick și direcția capului
        Vector3 direction = cameraTransform.forward*inputAxis.y+cameraTransform.right*inputAxis.x;

        // Mișcarea personajului
        character.Move(direction * Time.fixedDeltaTime * speed);

        // Sincronizare poziție capsule collider cu camera
        character.height = cameraTransform.localPosition.y;
        Vector3 capsuleCenter = transform.InverseTransformPoint(cameraTransform.position);
        character.center = new Vector3(capsuleCenter.x, character.height / 2, capsuleCenter.z);
    }


}