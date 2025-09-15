package main

import (
	"context"
	"fmt"
	"log"
	"time"
)



func main(){
	fmt.Println("welcome to markert-data-service");
	ctx :=context.Background();

	r:=NewRedisClient(RedisAddr);
	defer r.Close()
	out:=make(chan []byte,100);

	wsURL:=BinanceWSBase + "/"+Symbol;
	go ConnectAndStream(ctx,wsURL,out);
	for msg:=range out{
		if err:=r.Publish(ctx,RedisChannel,msg); err!=nil{
			log.Println("publish err: ",err)
		}else{
			log.Printf("published %d bytes\n",len(msg))
		}
	}
	time.Sleep(2*time.Second);
}
