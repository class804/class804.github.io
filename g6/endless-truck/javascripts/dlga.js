function Stanislic_SendInfo(Info)
{
	return false;
famobi.log ("Stanislic Send "+Info);
g_an('set', 'page', '/'+Info);
g_an('set', 'title', ''+Info);
g_an('send', 'pageview');
g_an('send', 'event', 'GameEvent', ''+Info);


}


function Stanislic_Start()
{

  Stanislic_SendInfo("Main_Page");


}
