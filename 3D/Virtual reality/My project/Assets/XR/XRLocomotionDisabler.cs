using UnityEngine;
using UnityEngine.InputSystem;

public class LocomotionDisabler : MonoBehaviour
{
    [SerializeField]
    [Tooltip("The reference to the action to start the teleport aiming mode for this controller.")]
    InputActionReference m_TeleportModeActivate;

    [SerializeField]
    [Tooltip("The reference to the action to cancel the teleport aiming mode for this controller.")]
    InputActionReference m_TeleportModeCancel;

    [SerializeField]
    [Tooltip("The reference to the action of continuous turning the XR Origin with this controller.")]
    InputActionReference m_Turn;

    [SerializeField]
    [Tooltip("The reference to the action of snap turning the XR Origin with this controller.")]
    InputActionReference m_SnapTurn;

    [SerializeField]
    [Tooltip("The reference to the action of moving the XR Origin with this controller.")]
    InputActionReference m_Move;
    private void OnEnable()
    {
        DisableLocomotionActions();
    }
    void DisableLocomotionActions()
    {
        DisableAction(m_Move);
        DisableAction(m_TeleportModeActivate);
        DisableAction(m_TeleportModeCancel);
        DisableAction(m_Turn);
        DisableAction(m_SnapTurn);
    }
    static void DisableAction(InputActionReference actionReference)
    {
        var action = GetInputAction(actionReference);
        if (action != null && action.enabled)
            action.Disable();
    }
    static InputAction GetInputAction(InputActionReference actionReference)
    {
#pragma warning disable IDE0031 // Use null propagation -- Do not use for UnityEngine.Object types
        return actionReference != null ? actionReference.action : null;
#pragma warning restore IDE0031
    }
}