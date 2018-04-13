<?php
$con=mysqli_connect("localhost","root","","thestarshipofdoom");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

if (isset($_POST['json'])) {
        // use json_decode() transform to array
        $request_json = json_decode($_POST['json'], true);
        $theuser = $request_json['user'];
		$thescore = $request_json['thescore'];
    
        $sql="INSERT INTO player (Name) VALUES ('$theuser')";
        $rs = mysqli_query($con,$sql);
        
        //get id of record inserted above.
        $playerID = mysqli_insert_id($con);
        
		$sql1="INSERT INTO score_tbl (userscore, PlayerID) VALUES ('$thescore', '$playerID')";
		$rs1 = mysqli_query($con,$sql1);
        if($rs && $rs1){
            echo "This is a message from PHP. The user:".$theuser." have stored his score : ".$thescore;
        }
		mysqli_close($con);
}
?>