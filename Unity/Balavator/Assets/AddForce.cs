using UnityEngine;
using System.Collections;

public class AddForce : MonoBehaviour {
    public int force;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
        GetComponent<Rigidbody>().AddForce(-transform.up * force, ForceMode.VelocityChange);
        GetComponent<Rigidbody>().useGravity = false;
    }

    void OnMouseDown()
    {
        
    }
}
