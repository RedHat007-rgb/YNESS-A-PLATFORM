package main

import (
	"context"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

func ConnectAndStream(ctx context.Context,wsURL string,out chan<- []byte){
	for{
		select {
		case <-ctx.Done():
			return
		default:
		}

		log.Println("ws dialing",wsURL);
		c,_,err:=websocket.DefaultDialer.Dial(wsURL,nil)
		if err!=nil{
			log.Println("Ws dial error",err)
			time.Sleep(2*time.Second);
			continue
		}
		log.Println("ws connected..")

		for {
			_,msg,err:=c.ReadMessage()
			if err!=nil{
				log.Println("ws read error",err);
				c.Close()
				break
			}
			out <-msg
		}

		time.Sleep(2*time.Second)
	}
}