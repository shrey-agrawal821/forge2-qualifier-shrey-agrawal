<?php

namespace Tests\Feature;

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KanbanApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_boards(): void
    {
        $board = Board::create([
            'title' => 'Test Board',
            'description' => 'Test Description',
        ]);

        $response = $this->getJson('/api/boards');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'title' => 'Test Board',
                     'description' => 'Test Description',
                 ]);
    }

    public function test_can_get_board_with_nested_relations(): void
    {
        $board = Board::create([
            'title' => 'Project Alpha',
        ]);

        $list = BoardList::create([
            'board_id' => $board->id,
            'title' => 'To Do',
            'position' => 0,
        ]);

        $card = Card::create([
            'list_id' => $list->id,
            'title' => 'Task 1',
            'position' => 0,
        ]);

        $response = $this->getJson("/api/boards/{$board->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('title', 'Project Alpha')
                 ->assertJsonCount(1, 'lists')
                 ->assertJsonPath('lists.0.title', 'To Do')
                 ->assertJsonCount(1, 'lists.0.cards')
                 ->assertJsonPath('lists.0.cards.0.title', 'Task 1');
    }

    public function test_can_create_board(): void
    {
        $response = $this->postJson('/api/boards', [
            'title' => 'New Board',
            'description' => 'Board created via API',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'title' => 'New Board',
                 ]);

        $this->assertDatabaseHas('boards', [
            'title' => 'New Board',
        ]);
    }

    public function test_can_update_card_position(): void
    {
        $board = Board::create(['title' => 'Board']);
        $list = BoardList::create([
            'board_id' => $board->id,
            'title' => 'List 1',
            'position' => 0,
        ]);
        $card = Card::create([
            'list_id' => $list->id,
            'title' => 'Task',
            'position' => 0,
        ]);

        $response = $this->putJson("/api/cards/{$card->id}", [
            'position' => 5,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('position', 5);

        $this->assertDatabaseHas('cards', [
            'id' => $card->id,
            'position' => 5,
        ]);
    }
}
