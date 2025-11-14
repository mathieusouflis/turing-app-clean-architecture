import { useEffect } from 'react';
import { Cell } from './Cell';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTape, useCreateTape, useExecuteStep, useResetTape } from '@/hooks/useTape';

export function MachineTuring() {
  const { data: tape, isLoading, error } = useTape();
  const createTape = useCreateTape();
  const executeStep = useExecuteStep();
  const resetTape = useResetTape();

  useEffect(() => {
    if (!tape && !createTape.isPending && !createTape.isSuccess && !createTape.isError) {
      createTape.mutate();
    }
  }, [tape, createTape.isPending, createTape.isSuccess, createTape.isError, createTape]);

  if (isLoading || createTape.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground animate-pulse">Loading...</div>
        {createTape.error && (
          <div className="mt-4 text-destructive">
            Error: {createTape.error.message}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-destructive font-bold">Error loading tape</div>
        <div className="text-sm text-muted-foreground">{error.message}</div>
        <Button onClick={() => createTape.mutate()} variant="outline">
          Retry Create Tape
        </Button>
      </div>
    );
  }

  if (!tape) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-foreground">No tape found</div>
        <Button onClick={() => createTape.mutate()} variant="default">
          Create Tape
        </Button>
        {createTape.error && (
          <div className="text-sm text-destructive">Error: {createTape.error.message}</div>
        )}
      </div>
    );
  }

  const tapeArray = tape.content.split('');
  const isHalted = tape.finalStates.includes(tape.currentState);

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
        Mini « machine à additionner »
      </h1>

      {/* Description */}
      <div className="text-center space-y-2 text-foreground">
        <p className="text-sm">
          Cette application simule une machine très simple inspirée de la machine de Turing. 
          Elle transforme des caractères en nombre unaire en avançant sur la bande jusqu'au premier souligné _, 
          qu'elle remplace par 1, puis s'arrête et se met dans un état HALT.
        </p>
        <p className="text-sm text-muted-foreground">
          Utilisez le bouton Step pour exécuter un pas, et Reset pour réinitialiser.
        </p>
      </div>

      {/* State and Head Position */}
      <div className="flex items-center gap-6 w-full justify-center">
        <div className="flex items-center gap-2">
          <span className="text-foreground">État:</span>
          <Badge 
            variant={isHalted ? 'destructive' : 'default'}
            className="font-mono text-lg px-4 py-1"
          >
            {tape.currentState}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground">Position de la tête:</span>
          <span className="text-foreground font-mono">{tape.headPosition}</span>
        </div>
      </div>

      {/* Tape Display */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-3 flex-wrap justify-center">
          {tapeArray.map((symbol, index) => (
            <Cell key={index} symbol={symbol} isHead={index === tape.headPosition} index={index} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={() => executeStep.mutate()}
          disabled={isHalted || executeStep.isPending}
          variant={isHalted ? 'secondary' : 'default'}
        >
          {executeStep.isPending ? 'Stepping...' : 'Step'}
        </Button>
        <Button
          onClick={() => resetTape.mutate()}
          variant="outline"
          disabled={resetTape.isPending}
        >
          {resetTape.isPending ? 'Resetting...' : 'Reset'}
        </Button>
      </div>
    </div>
  );
}
