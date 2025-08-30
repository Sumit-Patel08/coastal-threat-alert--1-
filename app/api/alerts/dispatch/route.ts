import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get all dispatched alerts
    const { data: dispatches, error } = await supabase
      .from('dispatches')
      .select(`
        *,
        alerts (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dispatches:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dispatches' },
        { status: 500 }
      );
    }

    return NextResponse.json({ dispatches });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { alert_id, dispatched_by, dispatch_notes, priority } = body;

    if (!alert_id || !dispatched_by) {
      return NextResponse.json(
        { error: 'Missing required fields: alert_id and dispatched_by' },
        { status: 400 }
      );
    }

    // Create new dispatch record
    const { data: dispatch, error } = await supabase
      .from('dispatches')
      .insert({
        alert_id,
        dispatched_by,
        dispatch_notes: dispatch_notes || '',
        priority: priority || 'medium',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dispatch:', error);
      return NextResponse.json(
        { error: 'Failed to create dispatch' },
        { status: 500 }
      );
    }

    // Update alert status to dispatched
    const { error: alertUpdateError } = await supabase
      .from('alerts')
      .update({ status: 'dispatched' })
      .eq('id', alert_id);

    if (alertUpdateError) {
      console.error('Error updating alert status:', alertUpdateError);
      // Don't fail the request if alert update fails
    }

    return NextResponse.json({ dispatch }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { id, status, dispatch_notes, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Update dispatch record
    const { data: dispatch, error } = await supabase
      .from('dispatches')
      .update({
        status: status || 'active',
        dispatch_notes: dispatch_notes || '',
        priority: priority || 'medium',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating dispatch:', error);
      return NextResponse.json(
        { error: 'Failed to update dispatch' },
        { status: 500 }
      );
    }

    return NextResponse.json({ dispatch });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Delete dispatch record
    const { error } = await supabase
      .from('dispatches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting dispatch:', error);
      return NextResponse.json(
        { error: 'Failed to delete dispatch' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Dispatch deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}