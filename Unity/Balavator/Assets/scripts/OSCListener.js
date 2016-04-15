private var UDPHost : String = "127.0.0.1";
private var listenerPort : int = 8000;
private var broadcastPort : int = 57131;
private var oscHandler : Osc;

private var eventName : String = "";
private var eventData : String = "";
private var counter : int = 0;
public var output_txt : GUIText;
private var strArr : String[];
private var peopleNum : int;
private var person1PosX : float;
private var person1PosY : float;
private var person2PosX : float;
private var person2PosY : float;
private var person3PosX : float;
private var person3PosY : float;
private var mWidth0 : float = 160;
private var mWidth : float = 440;
private var nHeight0 : float = 105;
private var nHeight : float = 350;
private var dWidth : float = 75;
private var angle : float = 3;
private var avatarCenter : Vector3;
private var lastAvatarCenter : Vector3;
private var jumpCount : int = 0;
public var testData : String;

public function Awake() {
    Application.targetFrameRate = 60;
}

public function Start ()
{	
	var udp : UDPPacketIO = GetComponent("UDPPacketIO");
	udp.init(UDPHost, broadcastPort, listenerPort);
	oscHandler = GetComponent("Osc");
	oscHandler.init(udp);
			
	oscHandler.SetAddressHandler("/eventTest", updateText);
	oscHandler.SetAddressHandler("/counterTest", counterTest);
	
}
Debug.Log("Running");

function Update () {
	output_txt.text = eventData;
    //eventData = testData;
	if(eventData != ""){
	    strArr = eventData.Split(" "[0]);
	    peopleNum = int.Parse(strArr[0]);
	    var strLength = strArr.length;
	    /*for(var i=0; i <strLength; i++){
	        Debug.Log(strArr[i]);
	    }*/
	    if(strLength > 1){
	        person1PosX = float.Parse(strArr[1]);
	    }
	    if(strLength > 2){
	        person1PosY = float.Parse(strArr[2]);
	    }
	    if(strLength > 3){
	        person2PosX = float.Parse(strArr[3]);
	    }
	    if(strLength > 4){
	        person2PosY = float.Parse(strArr[4]);
	    }
	    if(strLength > 5){
	        person3PosX = float.Parse(strArr[5]);
	    }
	    if(strLength > 6){
	        person3PosY = float.Parse(strArr[6]);
	    }
	
	    var avatar = GameObject.Find("Avatar");
	    var avatar2 = GameObject.Find("Avatar (1)");
	    var avatar3 = GameObject.Find("Avatar (2)");
	    
	    avatarCenter = new Vector3(0, 2.2, 0);
	    if(strLength > 2){
	        avatar.transform.localScale = new Vector3 (40,20,40);
	        //Debug.Log("1 avatar");
	        avatar.transform.position = new Vector3(
                Remap(person1PosX, mWidth0, mWidth, -dWidth, dWidth)
                ,avatar.transform.position.y ,
                Remap(person1PosY, nHeight0, nHeight, dWidth, -dWidth)
                );
	        avatarCenter = avatar.transform.position;
	    }
	    if(strLength > 4){
	        //Debug.Log("2 avatar");
	        avatar2.transform.localScale = new Vector3 (40,20,40);
	        avatar2.transform.position = new Vector3(
                Remap(person2PosX, mWidth0, mWidth, -dWidth, dWidth)
                ,avatar2.transform.position.y ,
                Remap(person2PosY, nHeight0, nHeight, dWidth, -dWidth)
                );
	        avatarCenter = (avatar.transform.position + avatar2.transform.position)/2;
	    }
	    if(strLength > 6){
	        avatar3.transform.localScale = new Vector3 (40,20,40);
	        avatar3.transform.position = new Vector3(
                Remap(person3PosX, mWidth0, mWidth, -dWidth, dWidth)
                ,avatar3.transform.position.y ,
                Remap(person3PosY, nHeight0, nHeight, dWidth, -dWidth)
                );
	        avatarCenter = (avatar.transform.position + avatar2.transform.position + avatar3.transform.position)/3;
	    }
	    avatar.transform.localScale = new Vector3 (0,0,0);
	    avatar2.transform.localScale = new Vector3 (0,0,0);
	    avatar3.transform.localScale = new Vector3 (0,0,0);

	    if(lastAvatarCenter.x != 0 || lastAvatarCenter.z != 0){
	        if(Mathf.Abs(avatarCenter.x - lastAvatarCenter.x) > 40 || Mathf.Abs(avatarCenter.z - lastAvatarCenter.z) > 40){
	            jumpCount ++;
	            output_txt.text += ("\n"+"JumpCount : " + jumpCount);
	            if(jumpCount < 100){
	                avatarCenter = lastAvatarCenter;
	            }
	            else {
	                jumpCount = 0;
	            }
	        }
	        else {
	            jumpCount = 0;
	        }
	    }

	    var tub = GameObject.Find("Tub");
	    tub.transform.eulerAngles = new Vector3 (
        Remap(avatarCenter.z, -dWidth, dWidth, -angle, angle)
        ,0,
        Remap(avatarCenter.x, -dWidth, dWidth, angle, -angle)
        );
	    output_txt.text += ("\n"+"center : " + avatarCenter.x + " " + avatarCenter.z);
	    
	    lastAvatarCenter = avatarCenter;
	    
	}
	

	var cube = GameObject.Find("Cube");
	var boxWidth:int = counter;
	cube.transform.localScale = Vector3(boxWidth,5,5);	

	if (Input.GetKey("escape"))
	    Application.Quit();
}	

public function updateText(oscMessage : OscMessage) : void
{	
	eventName = Osc.OscMessageToString(oscMessage);
	eventData = oscMessage.Values[0];
} 

public function counterTest(oscMessage : OscMessage) : void
{	
	Osc.OscMessageToString(oscMessage);
	counter = oscMessage.Values[0];
} 

public function Remap (value:float, from1:float, to1:float, from2:float, to2:float) : float {
    if(value <= from1){
        return from2;
    }
    else if (value >= to1){
        return to2;
    }
    else {
        return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
    }
    
}