import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs';

import { BookCommentService } from './book-comment.service';
import { BookComment } from 'src/schemas/book.comment.schema';

@WebSocketGateway(3005, {
  cors: {
    origin: '*',
  },
})
export class BookCommentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly bookCommentService: BookCommentService) {}

  @SubscribeMessage('getAllComments')
  async onGetAllComments(
    client: any,
    data: any,
  ): Promise<Observable<WsResponse<BookComment[]>>> {
    const comments = await this.bookCommentService.findAllBookComment(
      data.bookId,
    );

    return from([comments]).pipe(
      map((comments) => ({
        event: 'allComments',
        data: comments,
      })),
    );
  }

  @SubscribeMessage('addComment')
  async onAddComment(
    client: any,
    data: any,
  ): Promise<Observable<WsResponse<BookComment>>> {
    const newComment = await this.bookCommentService.create({
      bookId: data.bookId,
      comment: data.comment,
    });

    this.server.emit('newComment', newComment);

    return from([newComment]).pipe(
      map((comment) => ({
        event: 'addComment',
        data: comment,
      })),
    );
  }

  handleConnection(client: Socket) {
    console.log('Client connected');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }
}
